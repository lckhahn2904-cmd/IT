using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoversWatches.Areas.PrivatePages.Controllers
{
    public class ProductController : Controller
    {
        // GET: PrivatePages/NewProduct
        public ActionResult Index()
        {
            return View();
        }
    }
}