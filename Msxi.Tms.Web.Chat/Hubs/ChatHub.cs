using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Msxi.Tms.Web.Chat.Hubs
{
    public class ChatHub : Hub
    {
        /// <summary>
        /// Method which sends the message to the client
        /// </summary>
        /// <param name="name"></param>
        /// <param name="message"></param>
        public void Send(string name, string message)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.addNewMessageToPage(name, message);
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            Clients.All.onUserConnected("Nome Teste", "Olá, em que posso lhe ajudar?", true);
            return base.OnConnected();
        }

        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            //var item = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);

            Clients.All.onDisconnectedUser();
            return base.OnDisconnected(stopCalled);
        }
    }
}