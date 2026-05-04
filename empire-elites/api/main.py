"""
The Empire Elites - Minimal API for Vercel Deployment
Demonstrates the 21 agents including 5 integrity enforcers
"""

from fastapi import FastAPI
import os

app = FastAPI(title="The Empire Elites")

# Define all 21 agents (including 5 integrity agents)
AGENTS = [
    # Original 16 agents
    {"role": "Software Architect", "integrity": False},
    {"role": "Senior Developer", "integrity": False},
    {"role": "QA Engineer", "integrity": False},
    {"role": "DevOps Engineer", "integrity": False},
    {"role": "Project Manager", "integrity": False},
    {"role": "Development Quality & Time Supervisor", "integrity": False},
    {"role": "Integration Success Specialist", "integrity": False},
    {"role": "Chief of Staff & Personal Assistant", "integrity": False},
    {"role": "Sales & Lead Generation Specialist", "integrity": False},
    {"role": "Marketing & Brand Specialist", "integrity": False},
    {"role": "UX/UI Design Specialist", "integrity": False},
    {"role": "Cybersecurity & Compliance Specialist", "integrity": False},
    {"role": "Legal & Intellectual Property Specialist", "integrity": False},
    {"role": "Financial Strategy & Investment Specialist", "integrity": False},
    {"role": "Global Expansion & Localization Specialist", "integrity": False},
    {"role": "Requirements Analyst", "integrity": False},
    # NEW 5 Integrity Agents
    {"role": "Truth Guardian (Integrity Enforcer)", "integrity": True},
    {"role": "Honesty Auditor (The Admitter)", "integrity": True},
    {"role": "Reality Checker (The Validator)", "integrity": True},
    {"role": "Ethical Compliance Officer (The Moral Compass)", "integrity": True},
    {"role": "Radical Transparency Specialist (The Unpleaser)", "integrity": True},
]

TASKS = [
    "gather_and_analyze_project_requirements",
    "monitor_development_team_quality_timeline",
    "design_system_architecture",
    "implement_core_application_features",
    "integration_connectivity_validation",
    "user_experience_design_interface_creation",
    "execute_comprehensive_testing_strategy",
    "setup_production_deployment_pipeline",
    "strategic_sales_lead_generation",
    "brand_building_marketing_campaign",
    "enterprise_security_compliance_framework",
    "financial_strategy_investment_planning",
    "legal_foundation_intellectual_property_protection",
    "global_market_expansion_localization_strategy",
    "coordinate_project_delivery_stakeholder_communication",
    "final_quality_timeline_assessment",
    "excellence_validation_user_experience_optimization",
    "daily_progress_next_steps_briefing",
    # NEW 6 Integrity Tasks
    "truth_verification_audit",
    "honesty_compliance_audit",
    "reality_validation_check",
    "ethical_compliance_review",
    "radical_transparency_report",
    "final_integrity_seal_of_approval",
]

@app.get("/")
async def root():
    return {
        "name": "The Empire Elites API",
        "version": "2.0 - Integrity Division",
        "message": "No cheaters. No liars. No pleasers. Only truth."
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "integrity": "verified",
        "code": "EMPIRE_ELITES_V2"
    }

@app.get("/info")
async def info():
    return {
        "total_agents": len(AGENTS),
        "total_tasks": len(TASKS),
        "integrity_agents": len([a for a in AGENTS if a["integrity"]]),
        "integrity_tasks": 6,
        "motto": "Integrity above all"
    }

@app.get("/agents")
async def list_agents():
    return {
        "agents": AGENTS,
        "summary": {
            "total": len(AGENTS),
            "regular": len([a for a in AGENTS if not a["integrity"]]),
            "integrity_enforcers": len([a for a in AGENTS if a["integrity"]])
        }
    }

@app.get("/tasks")
async def list_tasks():
    return {
        "tasks": TASKS,
        "summary": {
            "total": len(TASKS),
            "regular": len(TASKS) - 6,
            "integrity_chain": 6
        }
    }

@app.get("/integrity")
async def integrity_info():
    return {
        "integrity_division": [
            {
                "name": "Truth Guardian",
                "mission": "Verify every output is FACTUAL - zero tolerance for hallucinations"
            },
            {
                "name": "Honesty Auditor", 
                "mission": "Admit when NO solution exists - never fake a fix to please user"
            },
            {
                "name": "Reality Checker",
                "mission": "Cross-verify all claims against real sources"
            },
            {
                "name": "Ethical Compliance Officer",
                "mission": "Ensure zero shortcuts, no cheating, complete ethical compliance"
            },
            {
                "name": "Radical Transparency Specialist",
                "mission": "Tell users what they NEED to hear, not what they WANT to hear"
            }
        ],
        "rules": [
            "No fabrication tolerated",
            "Admit when unsolvable",
            "Verify all sources",
            "Zero shortcuts",
            "Unfiltered truth"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)