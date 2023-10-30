namespace realAdviceTriggerSystemAPI.Models
{
    public class Token
    {
        public string? TokenValue { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? ExpiryDateTime { get; set; }
        public User? User { get; set; }
    }
}
