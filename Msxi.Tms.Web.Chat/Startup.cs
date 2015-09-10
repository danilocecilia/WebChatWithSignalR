using Owin;
using Microsoft.Owin;
[assembly: OwinStartup(typeof(Msxi.Tms.Web.Chat.Startup))]

namespace Msxi.Tms.Web.Chat
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }
    }
}