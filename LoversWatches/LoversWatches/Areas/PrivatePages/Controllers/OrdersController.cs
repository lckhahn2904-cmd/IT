using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoversWatches.Areas.PrivatePages.Controllers
{
    public class OrdersController : Controller
    {
        // GET: PrivatePages/Order
        public ActionResult Index()
        {
            return View();
        }
    }
}