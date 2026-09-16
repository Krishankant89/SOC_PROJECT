"""Local security event generator for SOC development/demo."""

import random
from datetime import datetime, timezone

from app.schemas.alert import AlertCreate
from app.services.alerts import create_alert
from sqlalchemy.orm import Session


EVENT_TEMPLATES = [
    {
        "source": "windows-security",
        "rule_name": "Multiple Failed Login Attempts",
        "severity": "high",
        "description": "Multiple authentication failures detected.",
    },
    {
        "source": "network-monitor",
        "rule_name": "Possible Port Scan",
        "severity": "critical",
        "description": "Multiple connection attempts detected against different ports.",
    },
    {
        "source": "endpoint-monitor",
        "rule_name": "Suspicious Process Execution",
        "severity": "high",
        "description": "A potentially suspicious process was detected.",
    },
    {
        "source": "firewall",
        "rule_name": "Blocked Malicious Connection",
        "severity": "medium",
        "description": "Firewall blocked a suspicious outbound connection.",
    },
    {
        "source": "authentication",
        "rule_name": "Successful Login",
        "severity": "info",
        "description": "User authentication succeeded.",
    },
]


def generate_demo_event(db: Session):
    """Generate one simulated security event and store it as an alert."""

    template = random.choice(EVENT_TEMPLATES)

    source_ip = f"192.168.1.{random.randint(10, 250)}"
    destination_ip = f"10.0.20.{random.randint(10, 250)}"

    payload = AlertCreate(
        source=template["source"],
        source_ip=source_ip,
        destination_ip=destination_ip,
        host="workstation-finance-07",
        rule_name=template["rule_name"],
        severity=template["severity"],
        description=template["description"],
        raw_event=(
            f'{{"source":"{template["source"]}",'
            f'"event":"{template["rule_name"]}",'
            f'"source_ip":"{source_ip}",'
            f'"destination_ip":"{destination_ip}"}}'
        ),
        timestamp=datetime.now(timezone.utc),
    )

    return create_alert(db, payload)