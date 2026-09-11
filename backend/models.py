from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    complaint_source = Column(String(100))
    customer_name = Column(String(255))
    product_name = Column(String(255))
    product_strength = Column(String(100))
    batch_number = Column(String(100))
    affected_quantity = Column(String(100))
    manufacturing_date = Column(String(100))
    expiry_date = Column(String(100))

    originating_site_block = Column(String(255))
    impacted_npm = Column(String(255))

    complaint_category = Column(String(255))
    complaint_description = Column(Text)

    severity = Column(String(50))
    suggested_action = Column(Text)
    risk_assessment = Column(Text)

    status = Column(String(50), default="Pending Triage")

    created_at = Column(
        DateTime,
        server_default=func.now()
    )
