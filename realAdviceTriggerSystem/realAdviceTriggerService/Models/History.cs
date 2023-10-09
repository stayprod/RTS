using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TriggerService.Models
{
    public partial class History
    {
        public int HistoryId { get; set; }
        public int ClientId { get; set; }
        public DateTime Date { get; set; } 
    }
} 
