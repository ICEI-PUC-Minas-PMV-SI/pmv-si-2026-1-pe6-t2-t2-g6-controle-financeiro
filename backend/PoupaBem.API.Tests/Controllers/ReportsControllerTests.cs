using Application.DTOs.Reports;
using Application.Interfaces.Repositories;
using Domain.Entites;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Moq;
using PoupaBem.API.Controllers;
using PoupaBem.API.Tests.Common;
using System.Text;

namespace PoupaBem.API.Tests.Controllers;

public class ReportsControllerTests
{
    [Fact]
    public async Task Summary_ShouldReturnUnauthorized_WhenUserClaimIsMissing()
    {
        var controller = new ReportsController();
        ControllerTestHelper.SetUser(controller, null);

        var reportRepositoryMock = new Mock<IFinancialReportRepository>();

        var result = await controller.Summary(reportRepositoryMock.Object, null, null, CancellationToken.None);

        Assert.IsType<UnauthorizedResult>(result);
        reportRepositoryMock.Verify(
            x => x.GetSummaryAsync(It.IsAny<Guid>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Summary_ShouldReturnOkWithSummary_WhenUserIsAuthenticated()
    {
        var controller = new ReportsController();
        var userId = Guid.NewGuid();
        ControllerTestHelper.SetUser(controller, userId);

        var reportRepositoryMock = new Mock<IFinancialReportRepository>();
        var fromUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var toUtc = new DateTime(2026, 1, 31, 23, 59, 59, DateTimeKind.Utc);

        var expected = new FinancialSummaryResponse
        {
            TotalIncome = 5000m,
            TotalExpense = 1800m,
            Balance = 3200m
        };

        reportRepositoryMock
            .Setup(x => x.GetSummaryAsync(userId, fromUtc, toUtc, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        var result = await controller.Summary(reportRepositoryMock.Object, fromUtc, toUtc, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        var payload = Assert.IsType<FinancialSummaryResponse>(ok.Value);

        Assert.Equal(expected.TotalIncome, payload.TotalIncome);
        Assert.Equal(expected.TotalExpense, payload.TotalExpense);
        Assert.Equal(expected.Balance, payload.Balance);
    }

    [Fact]
    public async Task ExpensesByCategory_ShouldReturnOkWithItems_WhenUserIsAuthenticated()
    {
        var controller = new ReportsController();
        var userId = Guid.NewGuid();
        ControllerTestHelper.SetUser(controller, userId);

        var reportRepositoryMock = new Mock<IFinancialReportRepository>();

        var items = new List<CategoryExpenseReportItem>
        {
            new() { CategoryId = Guid.NewGuid(), CategoryName = "Moradia", TotalAmount = 900m },
            new() { CategoryId = Guid.NewGuid(), CategoryName = "Transporte", TotalAmount = 450m }
        };

        reportRepositoryMock
            .Setup(x => x.GetExpenseTotalsByCategoryAsync(userId, null, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(items);

        var result = await controller.ExpensesByCategory(reportRepositoryMock.Object, null, null, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        var payload = Assert.IsAssignableFrom<IReadOnlyList<CategoryExpenseReportItem>>(ok.Value);

        Assert.Equal(2, payload.Count);
        Assert.Equal("Moradia", payload[0].CategoryName);
        Assert.Equal(900m, payload[0].TotalAmount);
    }

    [Fact]
    public async Task ExportTransactionsCsv_ShouldReturnUnauthorized_WhenUserClaimIsMissing()
    {
        var controller = new ReportsController();
        ControllerTestHelper.SetUser(controller, null);

        var transactionRepositoryMock = new Mock<ITransactionRepository>();

        var result = await controller.ExportTransactionsCsv(
            transactionRepositoryMock.Object,
            null,
            null,
            null,
            null,
            CancellationToken.None);

        Assert.IsType<UnauthorizedResult>(result);
        transactionRepositoryMock.Verify(
            x => x.GetFilteredAsync(
                It.IsAny<Guid>(),
                It.IsAny<DateTime?>(),
                It.IsAny<DateTime?>(),
                It.IsAny<Guid?>(),
                It.IsAny<TransactionType?>(),
                It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task ExportTransactionsCsv_ShouldReturnCsvFileWithEscapedValues_WhenUserIsAuthenticated()
    {
        var controller = new ReportsController();
        var userId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        ControllerTestHelper.SetUser(controller, userId);

        var fromUtc = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc);
        var toUtc = new DateTime(2026, 2, 28, 23, 59, 59, DateTimeKind.Utc);

        var transaction = new Transaction(
            "Mercado, \"Extra\"",
            null,
            149.90m,
            TransactionType.Expense,
            categoryId,
            userId,
            new DateTime(2026, 2, 10, 12, 0, 0, DateTimeKind.Utc));

        var transactionRepositoryMock = new Mock<ITransactionRepository>();

        transactionRepositoryMock
            .Setup(x => x.GetFilteredAsync(userId, fromUtc, toUtc, categoryId, TransactionType.Expense, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Transaction> { transaction });

        var result = await controller.ExportTransactionsCsv(
            transactionRepositoryMock.Object,
            fromUtc,
            toUtc,
            categoryId,
            TransactionType.Expense,
            CancellationToken.None);

        var file = Assert.IsType<FileContentResult>(result);
        Assert.Equal("text/csv; charset=utf-8", file.ContentType);
        Assert.StartsWith("transacoes_", file.FileDownloadName, StringComparison.Ordinal);
        Assert.EndsWith(".csv", file.FileDownloadName, StringComparison.Ordinal);

        var csv = Encoding.UTF8.GetString(file.FileContents).TrimStart('\uFEFF');

        Assert.Contains("occurred_at_utc,title,transaction_type,amount,category_id", csv, StringComparison.Ordinal);
        Assert.Contains("\"Mercado, \"\"Extra\"\"\"", csv, StringComparison.Ordinal);
        Assert.Contains("Expense", csv, StringComparison.Ordinal);

        transactionRepositoryMock.Verify(
            x => x.GetFilteredAsync(userId, fromUtc, toUtc, categoryId, TransactionType.Expense, It.IsAny<CancellationToken>()),
            Times.Once);
    }
}
