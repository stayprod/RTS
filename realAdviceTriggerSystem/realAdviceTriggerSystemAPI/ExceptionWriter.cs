namespace realAdviceTriggerSystemAPI
{
    public class ExceptionWriter
    {
        public void WriteException(Exception exp)
        {
            string filePath = @"/LogFile.txt";

            using (StreamWriter writer = new StreamWriter(filePath, true))
            {
                writer.WriteLine("-----------------------------------------------------------------------------");
                writer.WriteLine("Date : " + DateTime.Now.ToString());
                writer.WriteLine();

                while (exp != null)
                {
                    writer.WriteLine(exp.GetType().FullName);
                    writer.WriteLine("Message : " + exp.Message);
                    writer.WriteLine("StackTrace : " + exp.StackTrace);
                }
            }
        }
    }
}
