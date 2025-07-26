import pytest
from pydantic import ValidationError
from app.schemas.parameter import ParameterBase
from app.schemas.report import ReportScheduleBase
from app.models.parameter import ParameterType, ParameterCategory, SensitivityLevel
from app.schemas.report import ExportFormat


def test_parameter_base_range_validation():
    with pytest.raises(ValidationError):
        ParameterBase(name="p", min_value=5, max_value=3)

    p = ParameterBase(name="p", min_value=1, max_value=2)
    assert p.max_value == 2


def test_report_schedule_email_validation():
    with pytest.raises(ValidationError):
        ReportScheduleBase(
            name="r",
            cron_expression="* * * * *",
            template_id=1,
            email_recipients=["bad-email"]
        )

    rs = ReportScheduleBase(
        name="r",
        cron_expression="* * * * *",
        template_id=1,
        email_recipients=["valid@example.com"],
    )
    assert rs.email_recipients == ["valid@example.com"]

