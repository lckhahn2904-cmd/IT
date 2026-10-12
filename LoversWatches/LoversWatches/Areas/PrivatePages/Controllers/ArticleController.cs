using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoversWatches.Areas.PrivatePages.Controllers
{
    public class ArticleController : Controller
    {
        // GET: PrivatePages/NewArticle
        public ActionResult Index()
        {
            return View();
        }
    }
}