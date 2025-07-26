import numpy as np
import pytest
from app.simple_module import add, subtract, divide
import types
import sys

sys.modules.setdefault('scipy', types.ModuleType('scipy'))
sys.modules['scipy'].stats = types.SimpleNamespace()

from app.services.sensitivity_analyzer import (
    SensitivityAnalyzer,
    SensitivityResult,
    SensitivityConfig,
)
from app.services.virus_scanner import BasicFileScanner, VirusScanManager


def test_simple_module_operations():
    assert add(2, 3) == 5
    assert subtract(5, 1) == 4
    assert divide(9, 3) == 3
    with pytest.raises(ValueError):
        divide(1, 0)


@pytest.mark.asyncio
async def test_sensitivity_analyzer_helpers():
    analyzer = SensitivityAnalyzer(db=None)
    corr = analyzer._calculate_correlation([1, 2, 3], [2, 4, 6])
    assert pytest.approx(corr, 0.01) == 1.0
    results = [
        SensitivityResult(
            parameter_id=1,
            parameter_name="a",
            base_value=1,
            sensitivity_coefficient=0.5,
            impact_range=(0.1, 0.5),
        ),
        SensitivityResult(
            parameter_id=2,
            parameter_name="b",
            base_value=1,
            sensitivity_coefficient=-0.2,
            impact_range=(-0.2, 0.2),
        ),
    ]
    tornado = await analyzer._generate_tornado_chart_data(results)
    assert tornado["type"] == "tornado"
    mc = await analyzer._generate_monte_carlo_chart_data(
        np.array([1.0, 2.0, 3.0]),
        [np.array([1, 2, 3]), np.array([0.5, 1.0, 1.5])],
        [SensitivityConfig(parameter_id=1, min_value=0, max_value=1),
         SensitivityConfig(parameter_id=2, min_value=0, max_value=1)],
    )
    assert mc["type"] == "monte_carlo"
    spider = await analyzer._generate_spider_chart_data(
        {1: {"parameter_name": "a", "variation_results": {0.1: 1}}},
        [0.1],
    )
    assert spider["type"] == "spider"


@pytest.mark.asyncio
async def test_basic_file_scanner(tmp_path):
    scanner = BasicFileScanner()
    clean = tmp_path / "clean.txt"
    clean.write_text("hello")
    result = await scanner.scan_file(str(clean))
    assert result.is_clean
    eicar = tmp_path / "eicar.txt"
    eicar.write_bytes(b"X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*")
    result2 = await scanner.scan_file(str(eicar))
    assert not result2.is_clean


def test_virus_scan_manager_status(monkeypatch):
    monkeypatch.setenv("VIRUS_SCANNERS", "basic")
    manager = VirusScanManager()
    status = manager.get_scanner_status()
    assert "available_scanners" in status
