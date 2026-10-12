using LoversWatches.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoversWatches.Controllers
{
    public class InfoController : Controller
    {
        // GET: Info
        public ActionResult Index()
        {
            var model = new StudentInfo
            {
                Id = "SV001",
                Name = "Nguyễn Anh Tuấn",
                Marks = 9.5
            };
            // Truyền đối tượng model cho view
            return View(model);
        }

        public ActionResult Browser()
        {
            ViewBag.Title = "List of your mails";
            Mail mail1 = new Mail
            {
                From = "reciever1@gmail.com",
                To = "sender1@gmail.com",
                Subject = "Mail subject 1",
                Body = "Mail content 1"
            };

            Mail mail2 = new Mail
            {
                From = "reciever2@gmail.com",
                To = "sender2@gmail.com",
                Subject = "Mail subject 2",
                Body = "Mail content 2"
            };

              Mail mail3 = new Mail
            {
                From = "reciever3@gmail.com",
                To = "sender3@gmail.com",
                Subject = "Mail subject 3",
                Body = "Mail content 3"
            };

            List<Mail> mails = new List<Mail>();
            mails.Add(mail1);
            mails.Add(mail2);
            mails.Add(mail3);
            return View(mails);

            //ViewBag.MailList = mails;
            //ViewData["MailList"] = mails;
            //return View();
        }

    }
}