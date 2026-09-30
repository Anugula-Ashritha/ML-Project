reports = []


def add_report(report: dict):
    reports.append(report)


def get_reports() -> list[dict]:
    return [
        {key: value for key, value in report.items() if key != "file_path"}
        for report in reports
    ]


def remove_report(report_id: str) -> dict | None:
    for index, report in enumerate(reports):
        if report.get("id") == report_id:
            return reports.pop(index)
    return None
