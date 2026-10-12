using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoversWatches.Controllers
{
    public class Account : Controller
    {
        [HttpGet]
        // GET: Default
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(string Acc, string Pass)
        {
            bool isAuthentic = (Acc != null&&Pass!= null && Acc.Equals("admin")&& Pass.Equals("123456"));
            if (isAuthentic)
                return View("~/Areas/PrivtePages/Views/Dashboard/Index.cshtml");
            else
                //-- Nếu chứng thực không thành công thì vân Nạp view của Login lên để nó nhập lại
            return View();
        }
    }
}