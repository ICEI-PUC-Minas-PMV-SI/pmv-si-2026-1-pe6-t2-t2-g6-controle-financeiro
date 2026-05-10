using Application.Interfaces.Repositories;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PoupaBem.API.Extensions;
using System.Globalization;
using System.Text;

namespace PoupaBem.API.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    [HttpGet("summary")]
    public async Task<IActionResult> Summary(
        [FromServices] IFinancialReportRepository reportRepository,
        [FromQuery] DateTime? fromUtc,
        [FromQuery] DateTime? toUtc,
        CancellationToken cancellationToken)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var summary = await reportRepository.GetSummaryAsync(userId, fromUtc, toUtc, cancellationToken);
        return Ok(summary);
    }

    [HttpGet("expenses-by-category")]
    public async Task<IActionResult> ExpensesByCategory(
        [FromServices] IFinancialReportRepository reportRepository,
        [FromQuery] DateTime? fromUtc,
        [FromQuery] DateTime? toUtc,
        CancellationToken cancellationToken)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var items = await reportRepository.GetExpenseTotalsByCategoryAsync(userId, fromUtc, toUtc, cancellationToken);
        return Ok(items);
    }

    [HttpGet("transactions-export")]
    public async Task<IActionResult> ExportTransactionsCsv(
        [FromServices] ITransactionRepository transactionRepository,
        [FromQuery] DateTime? fromUtc,
        [FromQuery] DateTime? toUtc,
        [FromQuery] Guid? categoryId,
        [FromQuery] TransactionType? transactionType,
        CancellationToken cancellationToken)
    {
        if (!User.TryGetUserId(out var userId))
            return Unauthorized();

        var transactions = await transactionRepository.GetFilteredAsync(
            userId,
            fromUtc,
            toUtc,
            categoryId,
            transactionType,
            cancellationToken);

        var sb = new StringBuilder();
        sb.AppendLine("occurred_at_utc,title,transaction_type,amount,category_id");

        foreach (var t in transactions)
        {
            sb.Append(t.OcurredAt.ToString("o", CultureInfo.InvariantCulture));
            sb.Append(',');
            sb.Append(CsvEscape(t.Title));
            sb.Append(',');
            sb.Append(t.TransactionType.ToString());
            sb.Append(',');
            sb.Append(t.Amount.ToString(CultureInfo.InvariantCulture));
            sb.Append(',');
            sb.Append(t.CategoryId.ToString());
            sb.AppendLine();
        }

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
        var fileName = $"transacoes_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
        return File(bytes, "text/csv; charset=utf-8", fileName);
    }

    private static string CsvEscape(string value)
    {
        if (value.Contains('"') || value.Contains(',') || value.Contains('\n') || value.Contains('\r'))
            return $"\"{value.Replace("\"", "\"\"", StringComparison.Ordinal)}\"";
        return value;
    }
}
