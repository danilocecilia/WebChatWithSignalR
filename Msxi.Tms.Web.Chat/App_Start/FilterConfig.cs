using System.Web;
using System.Web.Mvc;

namespace Msxi.Tms.Web.Chat
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
