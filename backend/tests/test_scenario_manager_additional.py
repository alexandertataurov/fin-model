from unittest.mock import MagicMock, patch
import pytest
from app.services.scenario_manager import ScenarioManager, ScenarioComparison
from app.models.parameter import Scenario, ParameterValue, Parameter


def test_compare_scenarios_with_filter():
    db = MagicMock()
    base = Scenario(id=1)
    compare = Scenario(id=2)
    db.query.return_value.filter.return_value.first.side_effect = [base, compare]
    base_values = [
        ParameterValue(parameter_id=1, value=1),
        ParameterValue(parameter_id=2, value=2),
    ]
    comp_values = [
        ParameterValue(parameter_id=1, value=1.5),
        ParameterValue(parameter_id=2, value=2),
    ]
    db.query.return_value.filter.return_value.all.side_effect = [
        base_values,
        comp_values,
    ]
    manager = ScenarioManager(db)
    result = manager.compare_scenarios(1, 2, user_id=1, parameter_filters=[1])
    assert isinstance(result, ScenarioComparison)
    assert len(result.parameter_differences) == 1
    assert result.parameter_differences[0]["parameter_id"] == 1


def test_apply_scenario_values():
    db = MagicMock()
    pv = ParameterValue(parameter_id=1, value=2.0)
    pv.parameter = Parameter(source_sheet="Sheet", source_cell="A1")
    db.query.return_value.filter.return_value.all.return_value = [pv]
    manager = ScenarioManager(db)
    with patch.object(manager.formula_engine, "update_cell_value") as upd:
        import asyncio

        asyncio.run(manager._apply_scenario_values(1))
        upd.assert_called_once_with("Sheet!A1", 2.0)
