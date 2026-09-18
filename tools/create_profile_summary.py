from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "Shafeeqah-Francis-Portfolio-Summary.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#172320")
GREEN = colors.HexColor("#153D3A")
TEAL = colors.HexColor("#2B6962")
MINT = colors.HexColor("#DCEBE4")
CREAM = colors.HexColor("#F5F1E8")
MUTED = colors.HexColor("#53605C")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Name", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=26, leading=29, textColor=GREEN, alignment=TA_LEFT, spaceAfter=4))
styles.add(ParagraphStyle(name="Headline", parent=styles["Normal"], fontName="Helvetica", fontSize=10, leading=14, textColor=TEAL, spaceAfter=12))
styles.add(ParagraphStyle(name="Section", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=GREEN, spaceBefore=11, spaceAfter=6, uppercase=True))
styles.add(ParagraphStyle(name="BodySmall", parent=styles["BodyText"], fontName="Helvetica", fontSize=9, leading=13, textColor=MUTED, spaceAfter=6))
styles.add(ParagraphStyle(name="CardTitle", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=9.5, leading=12, textColor=GREEN, spaceAfter=3))
styles.add(ParagraphStyle(name="CardBody", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.2, leading=11, textColor=MUTED))
styles.add(ParagraphStyle(name="RoleLabel", parent=styles["Section"], textColor=colors.white, spaceBefore=0))
styles.add(ParagraphStyle(name="RoleBody", parent=styles["BodySmall"], textColor=colors.white, spaceAfter=0))


def card(title: str, body: str):
    return [Paragraph(title, styles["CardTitle"]), Paragraph(body, styles["CardBody"])]


doc = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=18 * mm,
    leftMargin=18 * mm,
    topMargin=16 * mm,
    bottomMargin=15 * mm,
    title="Shafeeqah Francis - Professional Portfolio Summary",
    author="Shafeeqah Francis",
)

story = [
    Paragraph("SHAFEEQAH FRANCIS", styles["Name"]),
    Paragraph("Quality Assurance and Compliance Operations Professional | Insurance Service Operations | Audits, SOPs, Reporting and Process Improvement", styles["Headline"]),
]

profile = Table([[Paragraph("PROFESSIONAL PROFILE", styles["Section"]), Paragraph("Structured, detail-focused operations professional with strengths in quality auditing, SOP compliance, reporting, documentation and process improvement. Comfortable coordinating across teams, tracking cases and workflows, escalating issues and turning recurring problems into practical improvement opportunities.", styles["BodySmall"]) ]], colWidths=[52*mm, 114*mm])
profile.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,-1), CREAM), ("BOX", (0,0), (-1,-1), .7, colors.HexColor("#D5D3CB")), ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 10), ("RIGHTPADDING", (0,0), (-1,-1), 10), ("TOPPADDING", (0,0), (-1,-1), 8), ("BOTTOMPADDING", (0,0), (-1,-1), 8)]))
story.extend([profile, Spacer(1, 5*mm), Paragraph("CORE CAPABILITIES", styles["Section"])])

capabilities = [
    card("QUALITY ASSURANCE", "Structured reviews, audit scorecards, evidence-based findings and clear feedback."),
    card("COMPLIANCE SUPPORT", "SOP adherence, records governance, exception tracking and reliable follow-through."),
    card("REPORTING", "Excel and KPI reporting, audit summaries and concise operational information."),
    card("ROOT-CAUSE ANALYSIS", "Recurring-issue identification, cause grouping and focused corrective actions."),
    card("OPERATIONS SUPPORT", "Case tracking, issue escalation, stakeholder communication and administration."),
    card("PROCESS IMPROVEMENT", "Current-state review, gap identification and practical consistency improvements."),
]
grid = Table([[capabilities[0], capabilities[1], capabilities[2]], [capabilities[3], capabilities[4], capabilities[5]]], colWidths=[55.3*mm]*3)
grid.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,-1), colors.white), ("GRID", (0,0), (-1,-1), .6, colors.HexColor("#D7DFDB")), ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 8), ("RIGHTPADDING", (0,0), (-1,-1), 8), ("TOPPADDING", (0,0), (-1,-1), 8), ("BOTTOMPADDING", (0,0), (-1,-1), 8)]))
story.extend([grid, Spacer(1, 4*mm), Paragraph("PORTFOLIO DEMONSTRATIONS", styles["Section"]), Paragraph("Self-directed work samples using fictional data to demonstrate practical approach and job-ready thinking.", styles["BodySmall"])])

projects = Table([
    [card("01  Service Quality Audit Scorecard", "Weighted review criteria, critical-failure tracking and a monthly KPI summary."), card("02  SOP Compliance Review", "Evidence checks, risk-rated exceptions, action ownership and closure tracking.")],
    [card("03  Recurring Issue Tracker", "Frequency and impact analysis that turns repeat issues into an action plan."), card("04  Case Escalation Workflow", "Priority triage, ownership, response targets and complete resolution evidence.")],
], colWidths=[83*mm, 83*mm])
projects.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,-1), MINT), ("GRID", (0,0), (-1,-1), .6, colors.HexColor("#BED3CB")), ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 9), ("RIGHTPADDING", (0,0), (-1,-1), 9), ("TOPPADDING", (0,0), (-1,-1), 8), ("BOTTOMPADDING", (0,0), (-1,-1), 8)]))
story.extend([projects, Spacer(1, 4*mm), Paragraph("CREDENTIALS", styles["Section"])])

credential_rows = [
    [Paragraph("Lean Six Sigma Yellow Belt", styles["CardTitle"]), Paragraph("Completed", styles["CardBody"])],
    [Paragraph("Lean Six Sigma Green Belt", styles["CardTitle"]), Paragraph("In progress", styles["CardBody"])],
    [Paragraph("TEFL Level 5 - The TEFL Academy", styles["CardTitle"]), Paragraph("2021", styles["CardBody"])],
]
credential_table = Table(credential_rows, colWidths=[132*mm, 34*mm])
credential_table.setStyle(TableStyle([("LINEBELOW", (0,0), (-1,-1), .5, colors.HexColor("#D7DFDB")), ("VALIGN", (0,0), (-1,-1), "MIDDLE"), ("LEFTPADDING", (0,0), (-1,-1), 0), ("RIGHTPADDING", (0,0), (-1,-1), 0), ("TOPPADDING", (0,0), (-1,-1), 5), ("BOTTOMPADDING", (0,0), (-1,-1), 5)]))
story.extend([credential_table, Spacer(1, 5*mm)])

roles = Table([[Paragraph("TARGET OPPORTUNITIES", styles["RoleLabel"]), Paragraph("Quality Assurance Analyst | Quality Auditor | Compliance Administrator | Operations Support Specialist | Insurance Service/Operations Analyst | Process Improvement Coordinator | Customer Service Quality Analyst", styles["RoleBody"]) ]], colWidths=[52*mm, 114*mm])
roles.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,-1), GREEN), ("TEXTCOLOR", (0,0), (-1,-1), colors.white), ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 10), ("RIGHTPADDING", (0,0), (-1,-1), 10), ("TOPPADDING", (0,0), (-1,-1), 8), ("BOTTOMPADDING", (0,0), (-1,-1), 8)]))
story.append(roles)

doc.build(story)
print(OUTPUT)
