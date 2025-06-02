# Placeholder for reports.py
# Define the necessary Pydantic models for reports here.

from pydantic import BaseModel
from datetime import date

class SalesReport(BaseModel):
    # Define fields for sales report
    pass

class ProductionReport(BaseModel):
    # Define fields for production report
    pass

class StaffPerformanceItem(BaseModel):
    id: int
    name: str
    attendance_records: int
    production_participation: int

class StaffPerformanceReport(BaseModel):
    staff: list[StaffPerformanceItem]

class ProductionAnalysisResponse(BaseModel):
    id: int
    product_id: int
    good_products: int
    damaged_products: int
    efficiency: float
    production_date: date

    class Config:
        from_attributes = True

class SalaryReportResponse(BaseModel):
    total_salary: float
    total_bonus: float
    total_deductions: float
    total_net_salary: float