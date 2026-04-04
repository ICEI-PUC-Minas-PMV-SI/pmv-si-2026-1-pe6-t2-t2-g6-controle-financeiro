using Application.DTOs.Categories;
using Application.Interfaces.Repositories;
using Domain.Entites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PoupaBem.API.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromServices] ICategoryRepository categoryRepository,
        [FromBody] CreateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var exists = await categoryRepository.ExistsByNameAsync(request.Name, userId, cancellationToken);

        if (exists)
            throw new ApplicationException("Já existe uma categoria com esse nome.");

        var category = new Category(request.Name, request.Type, userId);

        await categoryRepository.AddAsync(category, cancellationToken);

        return Ok(ToResponse(category));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromServices] ICategoryRepository categoryRepository,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var categories = await categoryRepository.GetByUserAsync(userId, cancellationToken);

        var response = categories.Select(ToResponse);
        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromServices] ICategoryRepository categoryRepository,
        [FromBody] UpdateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var category = await categoryRepository.GetOwnedTrackedByIdAsync(id, userId, cancellationToken)
            ?? throw new ApplicationException(
                "Categoria não encontrada ou não pode ser editada (apenas categorias criadas por você).");

        var nameTaken = await categoryRepository.ExistsByNameForUserExcludingIdAsync(
            request.Name,
            userId,
            id,
            cancellationToken);

        if (nameTaken)
            throw new ApplicationException("Já existe uma categoria com esse nome.");

        category.Update(request.Name, request.Type);
        await categoryRepository.SaveChangesAsync(cancellationToken);

        return Ok(ToResponse(category));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        [FromServices] ICategoryRepository categoryRepository,
        CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
            return Unauthorized();

        var category = await categoryRepository.GetOwnedTrackedByIdAsync(id, userId, cancellationToken)
            ?? throw new ApplicationException(
                "Categoria não encontrada ou não pode ser excluída (apenas categorias criadas por você).");

        var inUse = await categoryRepository.CountTransactionsUsingCategoryAsync(id, cancellationToken);

        if (inUse > 0)
            throw new ApplicationException("Não é possível excluir: existem transações vinculadas a esta categoria.");

        await categoryRepository.DeleteAsync(category, cancellationToken);

        return NoContent();
    }

    private static CategoryResponse ToResponse(Category x) => new()
    {
        Id = x.Id,
        Name = x.Name,
        Type = x.Type,
    };
}
