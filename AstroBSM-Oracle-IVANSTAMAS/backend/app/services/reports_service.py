# Placeholder for reports_service.py
# Implement the necessary service functions for handling reports here.

from sqlalchemy.orm import Session
from app.db.models.payroll import Payroll
from app.db.models.staff import Staff
from app.db.models.invoice import Invoice
from app.schemas.reports import SalaryReportResponse, StaffPerformanceReport, StaffPerformanceItem, SalesReport
from app.schemas.invoices import InvoiceOut
from sqlalchemy import func

class ReportsService:
    def generate_sales_report(self):
        # Add logic to generate sales report
        pass

    def generate_production_report(self):
        # Add logic to generate production report
        pass

    def generate_staff_performance_report(self):
        # Add logic to generate staff performance report
        pass

    def generate_salary_report(self, db: Session) -> SalaryReportResponse:
        """Generate a salary report by aggregating payroll data."""
        payroll_data = db.query(Payroll).all()

        total_salary = sum(item.salary for item in payroll_data)
        total_bonus = sum(item.bonus for item in payroll_data)
        total_deductions = sum(item.deductions for item in payroll_data)

        return SalaryReportResponse(
            total_salary=total_salary,
            total_bonus=total_bonus,
            total_deductions=total_deductions,
            total_net_salary=total_salary + total_bonus - total_deductions
        )

    @staticmethod
    def get_staff_performance_report(db: Session, start_date=None, end_date=None) -> StaffPerformanceReport:
        # For now, just count attendance and production participation as 0 (mock), real logic can be added later
        staff_members = db.query(Staff).all()
        staff_list = []
        for staff in staff_members:
            staff_list.append(StaffPerformanceItem(
                id=staff.id,
                name=staff.name,
                attendance_records=0,  # TODO: Replace with real attendance count
                production_participation=0  # TODO: Replace with real production participation
            ))
        return StaffPerformanceReport(staff=staff_list)

    @staticmethod
    def get_sales_report(db: Session, start_date: str, end_date: str) -> SalesReport:
        # Parse dates
        from datetime import datetime
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        # Query invoices in range
        invoices = db.query(Invoice).filter(Invoice.date >= start, Invoice.date <= end).all()
        total_sales = sum(inv.total_amount for inv in invoices)
        total_vat = sum(getattr(inv, 'vat', 0) or 0 for inv in invoices)
        transactions = [InvoiceOut.model_validate(inv).model_dump() for inv in invoices]
        return SalesReport(
            total_sales=total_sales,
            total_vat=total_vat,
            start_date=start.date(),
            end_date=end.date(),
            transactions=transactions
        )