"""
Test script for the Lean Financial Modeling Engine
"""

from app.services.lean_financial_engine import LeanFinancialEngine, CoreParameters
from app.services.lean_parameter_manager import LeanParameterManager, ParameterCategory


def test_comprehensive_financial_model():
    """Test the comprehensive financial modeling workflow"""
    
    print("=== Testing Lean Financial Modeling Engine ===\n")
    
    # Initialize engine and parameter manager
    engine = LeanFinancialEngine(db=None)  # No database for testing
    param_manager = LeanParameterManager(db=None)
    
    # Test 1: Basic model calculation
    print("1. Testing basic comprehensive model calculation...")
    base_params = CoreParameters()
    base_revenue = 2000000  # $2M base revenue
    
    model_result = engine.calculate_comprehensive_model(base_params, base_revenue)
    
    pl = model_result['profit_loss']
    bs = model_result['balance_sheet']
    cf = model_result['cash_flow']
    dcf = model_result['dcf_valuation']
    
    print(f"   Revenue: ${pl.total_revenue:,.2f}")
    print(f"   Net Income: ${pl.net_income:,.2f}")
    print(f"   Net Margin: {pl.net_margin_percentage:.2%}")
    print(f"   Total Assets: ${bs.total_assets:,.2f}")
    print(f"   Free Cash Flow: ${cf.free_cash_flow:,.2f}")
    print(f"   Enterprise Value: ${dcf.enterprise_value:,.2f}")
    print(f"   Value per Share: ${dcf.value_per_share:.2f}")
    print()
    
    # Test 2: Parameter management
    print("2. Testing parameter management system...")
    param_groups = param_manager.get_parameter_groups()
    print(f"   Total parameter categories: {len(param_groups)}")
    
    for category, group in param_groups.items():
        print(f"   - {group.name}: {len(group.parameters)} parameters")
    print()
    
    # Test 3: Scenario creation
    print("3. Testing scenario creation...")
    
    # Create optimistic scenario
    optimistic_params = {
        'product_revenue_growth': 0.15,  # 15% growth
        'service_revenue_growth': 0.20,  # 20% growth
        'direct_materials_percentage': 0.30,  # Improved efficiency
        'effective_tax_rate': 0.20  # Lower tax rate
    }
    
    optimistic_core_params = param_manager.create_core_parameters_from_dict(optimistic_params)
    optimistic_scenario = engine.create_scenario("Optimistic", optimistic_core_params, base_revenue)
    
    print(f"   Optimistic Scenario:")
    print(f"   Revenue: ${optimistic_scenario['profit_loss'].total_revenue:,.2f}")
    print(f"   Net Income: ${optimistic_scenario['profit_loss'].net_income:,.2f}")
    print(f"   Enterprise Value: ${optimistic_scenario['dcf_valuation'].enterprise_value:,.2f}")
    print()
    
    # Test 4: Scenario comparison
    print("4. Testing scenario comparison...")
    
    # Create conservative scenario
    conservative_params = {
        'product_revenue_growth': 0.02,  # 2% growth
        'service_revenue_growth': 0.03,  # 3% growth
        'direct_materials_percentage': 0.40,  # Higher costs
        'effective_tax_rate': 0.30  # Higher tax rate
    }
    
    conservative_core_params = param_manager.create_core_parameters_from_dict(conservative_params)
    conservative_scenario = engine.create_scenario("Conservative", conservative_core_params, base_revenue)
    base_scenario = engine.create_scenario("Base Case", base_params, base_revenue)
    
    scenarios = [base_scenario, optimistic_scenario, conservative_scenario]
    comparison = engine.compare_scenarios(scenarios)
    
    print("   Scenario Comparison:")
    for scenario in comparison['scenarios']:
        print(f"   - {scenario['name']}: EV ${scenario['enterprise_value']:,.0f}, "
              f"Revenue ${scenario['total_revenue']:,.0f}")
    print()
    
    # Test 5: Sensitivity analysis
    print("5. Testing sensitivity analysis...")
    
    sensitivity_params = ['product_revenue_growth', 'direct_materials_percentage', 'effective_tax_rate']
    sensitivity_result = param_manager.create_sensitivity_analysis(
        base_params, 
        sensitivity_params,
        variation_percent=0.20  # 20% variation
    )
    
    print(f"   Base Case Enterprise Value: ${sensitivity_result['base_case']['enterprise_value']:,.0f}")
    print("   Parameter Sensitivities:")
    
    for param, analysis in sensitivity_result['sensitivity_analysis'].items():
        upward_change = analysis['upward_case']['ev_change_percent']
        downward_change = analysis['downward_case']['ev_change_percent']
        print(f"   - {param}: +20% -> {upward_change:+.1f}% EV, -20% -> {downward_change:+.1f}% EV")
    print()
    
    # Test 6: Parameter templates
    print("6. Testing parameter templates...")
    
    templates = param_manager.create_scenario_templates()
    print(f"   Available templates: {', '.join(templates.keys())}")
    
    # Test recession scenario
    recession_params = param_manager.create_core_parameters_from_dict(templates['recession'])
    recession_model = engine.calculate_comprehensive_model(recession_params, base_revenue)
    
    print(f"   Recession Scenario:")
    print(f"   Revenue: ${recession_model['profit_loss'].total_revenue:,.2f}")
    print(f"   Net Income: ${recession_model['profit_loss'].net_income:,.2f}")
    print(f"   Enterprise Value: ${recession_model['dcf_valuation'].enterprise_value:,.2f}")
    print()
    
    print("=== All Tests Completed Successfully! ===")
    
    return {
        'base_model': model_result,
        'scenarios': scenarios,
        'comparison': comparison,
        'sensitivity': sensitivity_result,
        'templates': templates
    }


if __name__ == "__main__":
    try:
        results = test_comprehensive_financial_model()
        print("\nLean Financial Modeling Engine is working perfectly!")
        
        # Summary statistics
        base_model = results['base_model']
        print(f"\nSummary for $2M Base Revenue:")
        print(f"  Operating Margin: {base_model['profit_loss'].operating_margin_percentage:.1%}")
        print(f"  Current Ratio: {base_model['balance_sheet'].current_ratio:.2f}")
        print(f"  Free Cash Flow Margin: {base_model['cash_flow'].free_cash_flow_margin:.1%}")
        print(f"  WACC: {base_model['dcf_valuation'].wacc:.1%}")
        print(f"  P/E Ratio: {base_model['dcf_valuation'].equity_value / base_model['profit_loss'].net_income:.1f}")
        
    except Exception as e:
        print(f"Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()