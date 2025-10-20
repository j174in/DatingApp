using System;

namespace API.Errors;

public class ApiException(int _StatusCode, string _Message, string? _Details )
{
  public int StatusCode { get; set; } = _StatusCode;
  public string Message { get; set; } = _Message;
  public string? Details { get; set; } = _Details;
}
