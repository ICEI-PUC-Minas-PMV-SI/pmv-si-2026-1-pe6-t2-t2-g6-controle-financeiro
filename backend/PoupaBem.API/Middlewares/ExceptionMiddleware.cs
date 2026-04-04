using System.Net;
using System.Text.Json;

namespace PoupaBem.API.Middlewares;

public class ExceptionMiddleware(
    RequestDelegate next,
    ILogger<ExceptionMiddleware> logger,
    IHostEnvironment environment)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ExceptionMiddleware> _logger = logger;
    private readonly IHostEnvironment _environment = environment;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro não tratado na requisição {Method} {Path}",
                context.Request.Method,
                context.Request.Path);

            await HandleExceptionAsync(context, ex, _environment);
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception,
        IHostEnvironment environment)
    {
        var response = exception switch
        {
            ApplicationException => new ErrorResponse
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
                Error = "business_error",
                Message = exception.Message,
                Details = environment.IsDevelopment() ? exception.StackTrace : null
            },

            UnauthorizedAccessException => new ErrorResponse
            {
                StatusCode = (int)HttpStatusCode.Unauthorized,
                Error = "unauthorized",
                Message = exception.Message,
                Details = environment.IsDevelopment() ? exception.StackTrace : null
            },

            KeyNotFoundException => new ErrorResponse
            {
                StatusCode = (int)HttpStatusCode.NotFound,
                Error = "notfound",
                Message = exception.Message,
                Details = environment.IsDevelopment() ? exception.StackTrace : null
            },

            _ => new ErrorResponse
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Error = "internal_server_error",
                Message = "Ocorreu um erro interno no servidor.",
                Details = environment.IsDevelopment() ? exception.ToString() : null
            }
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = response.StatusCode;

        var json = JsonSerializer.Serialize(response);

        await context.Response.WriteAsync(json);
    }
}
