using System;
using System.Data.Entity;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LoversWatches.Models;

namespace LoversWatches.Controllers
{
    public class ProductController : Controller
    {
        // GET: Product
        public ActionResult Index(int categoryId = 1)
        {
            LoversWatches1_DBEntities db = new LoversWatches1_DBEntities();
            List<Product> Listproduct = db.Products
                                        .Include(cat => cat.Category)
                                        .Where(pro => pro.CatId == categoryId).ToList();
            return View(Listproduct);
        }
        public ActionResult Details(int id)
        {
            LoversWatches1_DBEntities db = new LoversWatches1_DBEntities();
            Product product = db.Products.Include(cat => cat.Category).FirstOrDefault(x => x.ProId == id);

            return View(product);
        }
    }
}