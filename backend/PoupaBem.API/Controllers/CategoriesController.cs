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
            throw new ApplicationException("Já existe uma categoria com essse nome.");

        var category = new Category(request.Name, request.Type, userId);

        await categoryRepository.AddAsync(category, cancellationToken);

        return Ok(new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            Type = category.Type,
        });
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

        var response = categories.Select(x => new CategoryResponse
        {
            Id = x.Id,
            Name = x.Name,
            Type = x.Type,
        });

        return Ok(response);
    }
}
