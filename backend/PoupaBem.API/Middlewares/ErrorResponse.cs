namespace PoupaBem.API.Middlewares;

public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Error { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string? Details { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
