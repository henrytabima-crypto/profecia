#!/usr/bin/env python3
"""Generate a private, local GLB with the open-source TripoSR model.

The TripoSR repository and model weights must be available locally. Source
images are read from disk and are never uploaded by this script.
"""

from __future__ import annotations

import argparse
import sys
import types
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from skimage import measure


def prepare_image(source: Path) -> Image.Image:
    rgba = Image.open(source).convert("RGBA")
    background = Image.new("RGBA", rgba.size, (128, 128, 128, 255))
    composited = Image.alpha_composite(background, rgba).convert("RGB")
    composited.thumbnail((512, 512), Image.Resampling.LANCZOS)

    canvas = Image.new("RGB", (512, 512), (128, 128, 128))
    x = (canvas.width - composited.width) // 2
    y = (canvas.height - composited.height) // 2
    canvas.paste(composited, (x, y))
    return canvas


def generate(
    source: Path,
    output: Path,
    repository: Path,
    resolution: int,
) -> None:
    sys.path.insert(0, str(repository))

    # TripoSR imports torchmcubes eagerly. Its CPU extension is not needed
    # here because the compatibility forward pass below uses scikit-image.
    torchmcubes_stub = types.ModuleType("torchmcubes")
    torchmcubes_stub.marching_cubes = lambda *_args, **_kwargs: None
    sys.modules["torchmcubes"] = torchmcubes_stub

    from tsr.system import TSR  # pylint: disable=import-outside-toplevel
    from tsr.models.isosurface import (  # pylint: disable=import-outside-toplevel
        MarchingCubeHelper,
    )

    def extract_on_cpu(self: MarchingCubeHelper, level: torch.Tensor):
        volume = (
            -level.view(self.resolution, self.resolution, self.resolution)
        ).detach().float().cpu().numpy()
        vertices, faces, _normals, _values = measure.marching_cubes(volume, level=0.0)
        vertices = np.ascontiguousarray(vertices[:, [2, 1, 0]])
        vertices = vertices / (self.resolution - 1.0)
        return (
            torch.from_numpy(vertices).to(level.device),
            torch.from_numpy(np.ascontiguousarray(faces)).to(level.device),
        )

    # The official torchmcubes CPU extension currently rejects tensors from
    # recent Apple Silicon PyTorch builds. Scikit-image provides the same
    # marching-cubes step without changing TripoSR inference.
    MarchingCubeHelper.forward = extract_on_cpu  # type: ignore[method-assign]

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    model = TSR.from_pretrained(
        "stabilityai/TripoSR",
        config_name="config.yaml",
        weight_name="model.ckpt",
    )
    model.renderer.set_chunk_size(4096)
    model.to(device)

    image = prepare_image(source)
    with torch.no_grad():
        scene_codes = model([image], device=device)
        meshes = model.extract_mesh(scene_codes, True, resolution=resolution)

    output.parent.mkdir(parents=True, exist_ok=True)
    meshes[0].export(output, file_type="glb")
    print(output.resolve())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--triposr-repo", type=Path, required=True)
    parser.add_argument("--resolution", type=int, default=128)
    args = parser.parse_args()
    generate(
        args.source.resolve(),
        args.output.resolve(),
        args.triposr_repo.resolve(),
        args.resolution,
    )


if __name__ == "__main__":
    main()
