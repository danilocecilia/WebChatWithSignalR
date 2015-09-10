using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Msxi.Tms.Web.Chat.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index(int id)
        {
            var user = new User();

            if(id == 1)
                user = new User() { Name = "Danilo", Profile = "Admin",  };
            else if(id == 2)
                user = new User() { Name = "Joao", Profile = "User" };

            ViewBag.Msg = "Olá, em que posso lhe ajudar?";

            return View(user);
        }

        public class User
        {
            public string Name { get; set; }
            public string Profile { get; set; }
        }

    }
}