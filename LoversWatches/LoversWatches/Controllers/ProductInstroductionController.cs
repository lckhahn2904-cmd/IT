using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoversWatches.Views
{
    public class ProductInstroductionController : Controller
    {
        // GET: ProductInstroduction
        public ActionResult Index(int Category = Id)
        {
            LoversWatches_DBEntities9 dBEntities9 = new LoversWatches_DBEntities9();

            return View();
        }
    }
}