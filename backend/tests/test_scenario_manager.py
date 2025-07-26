import pytest
from unittest.mock import Mock, patch, AsyncMock, MagicMock
from sqlalchemy.orm import Session
from datetime import datetime
import json

from app.services.scenario_manager import (
    ScenarioManager,
    ScenarioComparison,
    ScenarioCloneResult
)
from app.models.parameter import Scenario, Parameter, ParameterValue, CalculationAudit
from app.models.file import UploadedFile
from app.models.user import User


class TestScenarioManager:
    @pytest.fixture
    def mock_db(self):
        return Mock(spec=Session)

    @pytest.fixture
    def scenario_manager(self, mock_db):
        return ScenarioManager(mock_db)

    @pytest.fixture
    def sample_user(self):
        return User(
            id=1,
            email="test@example.com",
            username="testuser",
            is_active=True
        )

    @pytest.fixture
    def sample_file(self):
        return UploadedFile(
            id=1,
            filename="test_model.xlsx",
            original_filename="test_model.xlsx",
            user_id=1,
            upload_date=datetime.now(),
            file_size=1024,
            status="processed"
        )

    @pytest.fixture
    def sample_scenario(self):
        return Scenario(
            id=1,
            name="Base Scenario",
            description="Base financial scenario",
            is_baseline=True,
            base_file_id=1,
            version=1,
            created_by_id=1
        )

    @pytest.fixture
    def sample_parameter(self):
        return Parameter(
            id=1,
            name="Revenue Growth Rate",
            parameter_type="percentage",
            default_value=0.05,
            min_value=0.0,
            max_value=1.0,
            file_id=1
        )

    @pytest.fixture
    def sample_parameter_value(self):
        return ParameterValue(
            id=1,
            parameter_id=1,
            scenario_id=1,
            value=0.08,
            created_by_id=1
        )

    @pytest.mark.asyncio
    async def test_create_scenario_success(self, scenario_manager, mock_db, sample_file):
        """Test successful scenario creation"""
        mock_db.query.return_value.filter.return_value.first.return_value = sample_file
        mock_db.flush = Mock()
        mock_db.commit = Mock()
        mock_db.refresh = Mock()
        
        with patch.object(scenario_manager, '_generate_version_number', return_value=1) as mock_version, \
             patch.object(scenario_manager, '_initialize_parameter_values') as mock_init:
            
            result = await scenario_manager.create_scenario(
                name="Test Scenario",
                description="A test scenario",
                base_file_id=1,
                user_id=1,
                is_baseline=True
            )
            
            mock_db.add.assert_called_once()
            mock_db.flush.assert_called_once()
            mock_db.commit.assert_called_once()
            mock_version.assert_called_once_with(None)
            mock_init.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_scenario_file_not_found(self, scenario_manager, mock_db):
        """Test scenario creation with non-existent file"""
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        with pytest.raises(ValueError, match="Base file not found"):
            await scenario_manager.create_scenario(
                name="Test Scenario",
                description="A test scenario",
                base_file_id=999,
                user_id=1
            )

    @pytest.mark.asyncio
    async def test_create_scenario_with_parent(self, scenario_manager, mock_db, sample_file, sample_scenario):
        """Test scenario creation with parent scenario"""
        mock_db.query.return_value.filter.return_value.first.side_effect = [sample_file, sample_scenario]
        mock_db.flush = Mock()
        mock_db.commit = Mock()
        mock_db.refresh = Mock()
        
        with patch.object(scenario_manager, '_generate_version_number', return_value=2) as mock_version, \
             patch.object(scenario_manager, '_copy_parameter_values') as mock_copy:
            
            result = await scenario_manager.create_scenario(
                name="Child Scenario",
                description="A child scenario",
                base_file_id=1,
                user_id=1,
                parent_scenario_id=1
            )
            
            mock_version.assert_called_once_with(1)
            mock_copy.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_scenario_parent_not_found(self, scenario_manager, mock_db, sample_file):
        """Test scenario creation with non-existent parent"""
        mock_db.query.return_value.filter.return_value.first.side_effect = [sample_file, None]
        
        with pytest.raises(ValueError, match="Parent scenario not found"):
            await scenario_manager.create_scenario(
                name="Test Scenario",
                description="A test scenario",
                base_file_id=1,
                user_id=1,
                parent_scenario_id=999
            )

    @pytest.mark.asyncio
    async def test_clone_scenario_success(self, scenario_manager, mock_db, sample_scenario):
        """Test successful scenario cloning"""
        mock_db.query.return_value.filter.return_value.first.return_value = sample_scenario
        mock_db.query.return_value.filter.return_value.count.return_value = 5
        
        new_scenario = Scenario(id=2, name="Cloned Scenario")
        
        with patch.object(scenario_manager, 'create_scenario', return_value=new_scenario) as mock_create:
            result = await scenario_manager.clone_scenario(
                source_scenario_id=1,
                new_name="Cloned Scenario",
                new_description="A cloned scenario",
                user_id=1
            )
            
            assert result.success is True
            assert result.original_scenario_id == 1
            assert result.new_scenario_id == 2
            assert result.parameters_copied == 5
            assert result.error_message is None
            mock_create.assert_called_once()

    @pytest.mark.asyncio
    async def test_clone_scenario_source_not_found(self, scenario_manager, mock_db):
        """Test scenario cloning with non-existent source"""
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        result = await scenario_manager.clone_scenario(
            source_scenario_id=999,
            new_name="Cloned Scenario",
            new_description="A cloned scenario",
            user_id=1
        )
        
        assert result.success is False
        assert result.error_message == "Source scenario not found"
        assert result.original_scenario_id == 999
        assert result.new_scenario_id == 0

    def test_get_scenario_by_id(self, scenario_manager, mock_db, sample_scenario):
        """Test retrieving scenario by ID"""
        mock_db.query.return_value.filter.return_value.first.return_value = sample_scenario
        
        result = scenario_manager.get_scenario_by_id(1, user_id=1)
        
        assert result == sample_scenario
        mock_db.query.assert_called_with(Scenario)

    def test_get_scenario_by_id_not_found(self, scenario_manager, mock_db):
        """Test retrieving non-existent scenario"""
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        result = scenario_manager.get_scenario_by_id(999, user_id=1)
        
        assert result is None

    def test_get_user_scenarios(self, scenario_manager, mock_db):
        """Test retrieving all user scenarios"""
        scenarios = [
            Scenario(id=1, name="Scenario 1", created_by_id=1),
            Scenario(id=2, name="Scenario 2", created_by_id=1)
        ]
        mock_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = scenarios
        
        result = scenario_manager.get_user_scenarios(user_id=1)
        
        assert len(result) == 2
        assert result[0].name == "Scenario 1"
        assert result[1].name == "Scenario 2"

    def test_delete_scenario(self, scenario_manager, mock_db, sample_scenario):
        """Test scenario deletion"""
        mock_db.query.return_value.filter.return_value.first.return_value = sample_scenario
        mock_db.delete = Mock()
        mock_db.commit = Mock()
        
        result = scenario_manager.delete_scenario(1, user_id=1)
        
        assert result is True
        mock_db.delete.assert_called_once_with(sample_scenario)
        mock_db.commit.assert_called_once()

    def test_delete_scenario_not_found(self, scenario_manager, mock_db):
        """Test deleting non-existent scenario"""
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        result = scenario_manager.delete_scenario(999, user_id=1)
        
        assert result is False

    def test_update_parameter_value(self, scenario_manager, mock_db, sample_parameter_value):
        """Test updating parameter value in scenario"""
        mock_db.query.return_value.filter.return_value.first.return_value = sample_parameter_value
        mock_db.commit = Mock()
        mock_db.refresh = Mock()
        
        result = scenario_manager.update_parameter_value(
            scenario_id=1,
            parameter_id=1,
            new_value=0.10,
            user_id=1
        )
        
        assert result is not None
        assert result.value == 0.10
        mock_db.commit.assert_called_once()

    def test_update_parameter_value_not_found(self, scenario_manager, mock_db):
        """Test updating non-existent parameter value"""
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        result = scenario_manager.update_parameter_value(
            scenario_id=999,
            parameter_id=999,
            new_value=0.10,
            user_id=1
        )
        
        assert result is None

    @pytest.mark.asyncio
    async def test_calculate_scenario_results(self, scenario_manager, mock_db, sample_scenario):
        """Test scenario calculation"""
        parameter_values = [
            ParameterValue(parameter_id=1, value=0.05),
            ParameterValue(parameter_id=2, value=1000)
        ]
        mock_db.query.return_value.filter.return_value.first.return_value = sample_scenario
        mock_db.query.return_value.filter.return_value.all.return_value = parameter_values
        
        with patch.object(scenario_manager.formula_engine, 'calculate_scenario') as mock_calc:
            mock_calc.return_value = {"revenue": 105000, "profit": 21000}
            
            result = await scenario_manager.calculate_scenario_results(1, user_id=1)
            
            assert "revenue" in result
            assert "profit" in result
            mock_calc.assert_called_once()

    def test_compare_scenarios(self, scenario_manager, mock_db):
        """Test scenario comparison"""
        base_scenario = Scenario(id=1, name="Base")
        compare_scenario = Scenario(id=2, name="Compare")
        
        mock_db.query.return_value.filter.return_value.first.side_effect = [base_scenario, compare_scenario]
        
        base_params = [ParameterValue(parameter_id=1, value=0.05)]
        compare_params = [ParameterValue(parameter_id=1, value=0.08)]
        
        mock_db.query.return_value.filter.return_value.all.side_effect = [base_params, compare_params]
        
        result = scenario_manager.compare_scenarios(
            base_scenario_id=1,
            compare_scenario_id=2,
            user_id=1
        )
        
        assert isinstance(result, ScenarioComparison)
        assert result.base_scenario_id == 1
        assert result.compare_scenario_id == 2
        assert len(result.parameter_differences) > 0

    def test_compare_scenarios_not_found(self, scenario_manager, mock_db):
        """Test scenario comparison with non-existent scenarios"""
        mock_db.query.return_value.filter.return_value.first.side_effect = [None, None]
        
        with pytest.raises(ValueError, match="One or both scenarios not found"):
            scenario_manager.compare_scenarios(
                base_scenario_id=999,
                compare_scenario_id=998,
                user_id=1
            )


class TestScenarioComparison:
    """Test ScenarioComparison dataclass"""
    
    def test_scenario_comparison_creation(self):
        """Test ScenarioComparison creation"""
        comparison = ScenarioComparison(
            base_scenario_id=1,
            compare_scenario_id=2,
            parameter_differences=[
                {"parameter_id": 1, "base_value": 0.05, "compare_value": 0.08}
            ],
            summary_statistics={"total_differences": 1},
            variance_analysis={"max_variance": 0.03}
        )
        
        assert comparison.base_scenario_id == 1
        assert comparison.compare_scenario_id == 2
        assert len(comparison.parameter_differences) == 1
        assert comparison.summary_statistics["total_differences"] == 1

    def test_scenario_comparison_empty(self):
        """Test ScenarioComparison with empty data"""
        comparison = ScenarioComparison(
            base_scenario_id=1,
            compare_scenario_id=2,
            parameter_differences=[],
            summary_statistics={},
            variance_analysis={}
        )
        
        assert len(comparison.parameter_differences) == 0
        assert len(comparison.summary_statistics) == 0
        assert len(comparison.variance_analysis) == 0


class TestScenarioCloneResult:
    """Test ScenarioCloneResult dataclass"""
    
    def test_scenario_clone_result_success(self):
        """Test successful ScenarioCloneResult"""
        result = ScenarioCloneResult(
            original_scenario_id=1,
            new_scenario_id=2,
            parameters_copied=5,
            success=True
        )
        
        assert result.original_scenario_id == 1
        assert result.new_scenario_id == 2
        assert result.parameters_copied == 5
        assert result.success is True
        assert result.error_message is None

    def test_scenario_clone_result_failure(self):
        """Test failed ScenarioCloneResult"""
        result = ScenarioCloneResult(
            original_scenario_id=1,
            new_scenario_id=0,
            parameters_copied=0,
            success=False,
            error_message="Source scenario not found"
        )
        
        assert result.success is False
        assert result.error_message == "Source scenario not found"
        assert result.new_scenario_id == 0
        assert result.parameters_copied == 0


class TestScenarioManagerIntegration:
    """Integration tests for ScenarioManager"""
    
    @pytest.mark.integration
    @pytest.mark.asyncio
    async def test_full_scenario_workflow(self, db_session):
        """Test complete scenario creation and management workflow"""
        scenario_manager = ScenarioManager(db_session)
        
        # Create test user and file
        user = User(email="test@example.com", username="testuser", hashed_password="hashed")
        db_session.add(user)
        db_session.commit()
        
        uploaded_file = UploadedFile(
            filename="test.xlsx",
            original_filename="test.xlsx",
            user_id=user.id,
            file_size=1024,
            status="processed"
        )
        db_session.add(uploaded_file)
        db_session.commit()
        
        # Create base scenario
        base_scenario = await scenario_manager.create_scenario(
            name="Base Case",
            description="Base financial scenario",
            base_file_id=uploaded_file.id,
            user_id=user.id,
            is_baseline=True
        )
        
        assert base_scenario.name == "Base Case"
        assert base_scenario.is_baseline is True
        assert base_scenario.created_by_id == user.id
        
        # Clone the scenario
        clone_result = await scenario_manager.clone_scenario(
            source_scenario_id=base_scenario.id,
            new_name="Optimistic Case",
            new_description="Optimistic scenario",
            user_id=user.id
        )
        
        assert clone_result.success is True
        assert clone_result.new_scenario_id != base_scenario.id
        
        # Verify scenarios exist
        user_scenarios = scenario_manager.get_user_scenarios(user.id)
        assert len(user_scenarios) == 2
        
        # Clean up
        scenario_manager.delete_scenario(base_scenario.id, user_id=user.id)
        scenario_manager.delete_scenario(clone_result.new_scenario_id, user_id=user.id)

    @pytest.mark.integration
    def test_parameter_value_management(self, db_session):
        """Test parameter value operations"""
        scenario_manager = ScenarioManager(db_session)
        
        # Create test data
        user = User(email="test@example.com", username="testuser", hashed_password="hashed")
        db_session.add(user)
        db_session.commit()
        
        uploaded_file = UploadedFile(
            filename="test.xlsx",
            original_filename="test.xlsx", 
            user_id=user.id,
            file_size=1024,
            status="processed"
        )
        db_session.add(uploaded_file)
        db_session.commit()
        
        scenario = Scenario(
            name="Test Scenario",
            base_file_id=uploaded_file.id,
            created_by_id=user.id,
            version=1
        )
        db_session.add(scenario)
        db_session.commit()
        
        parameter = Parameter(
            name="Growth Rate",
            parameter_type="percentage",
            default_value=0.05,
            file_id=uploaded_file.id
        )
        db_session.add(parameter)
        db_session.commit()
        
        # Create parameter value
        param_value = ParameterValue(
            parameter_id=parameter.id,
            scenario_id=scenario.id,
            value=0.08,
            created_by_id=user.id
        )
        db_session.add(param_value)
        db_session.commit()
        
        # Update parameter value
        updated_value = scenario_manager.update_parameter_value(
            scenario_id=scenario.id,
            parameter_id=parameter.id,
            new_value=0.10,
            user_id=user.id
        )
        
        assert updated_value is not None
        assert updated_value.value == 0.10