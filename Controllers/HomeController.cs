using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Threading;

namespace reactRedux2.Controllers
{
    public class HomeController : ApplicationController
    {
        public IActionResult Index()
        {
			CultureInfo thisCulture = Thread.CurrentThread.CurrentCulture;
			ViewData["locale"] = thisCulture.CompareInfo.Name;

			return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
