using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoversWatches.Views
{
    public class AccountController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {

            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(string Acc, string Pass)
        {
            bool isAuthentic = (Acc!= null && Pass!=null&& Acc.ToLower().Equals("admin")&&Pass.Equals("123456"));
            if (isAuthentic)
                return View("~/Areas/PrivatePges/View/Dashboard/Index.cshtml");
            else
            return View();

        }
    }
}