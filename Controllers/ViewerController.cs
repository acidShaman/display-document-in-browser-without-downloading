using System.IO;
using GroupDocs.Viewer;
using GroupDocs.Viewer.Options;
using Microsoft.AspNetCore.Mvc;

namespace viewer_angular.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PageController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            Stream stream = GetPageStream();

            return File(stream, "text/html");
        }

        private Stream GetPageStream()
        {
            MemoryStream outputStream = new MemoryStream();

            string fileName = "sample.pdf";
            FileType fileType = FileType.FromExtension(Path.GetExtension(fileName));

            using (Viewer viewer = new Viewer(() => GetSourceFileStream(fileName), () => new LoadOptions(fileType)))
            {
                JpgViewOptions Options = new JpgViewOptions(
                    (pageNumber) => outputStream, 
                    (pageNumber, pageStream) => { });
                viewer.View(Options);
            }

            outputStream.Position = 0;

            return outputStream;
        }

        private Stream GetSourceFileStream(string fileName) => 
            new MemoryStream(GetSourceFileBytesFromDb(fileName));

        //TODO: Pull the data from the DB
        private byte[] GetSourceFileBytesFromDb(string fileName) => 
            System.IO.File.ReadAllBytes(fileName);
    }
}
