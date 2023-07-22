import multer from 'multer';
import bodyParser from 'body-parser';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const config = {
    api: {
      bodyParser: false
    }
  }

const urlencodedParser = bodyParser.urlencoded({ extended: false });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {

      upload.single('file')(req, res, async function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error uploading file.' });
        }

        // Access the text data from the request body
        urlencodedParser(req, res, async function () {
            const { question, filename } = req.body;
  
            // Here, you can access the uploaded file using "req.file"

            const uploadedFile = req.file;

            const fileBlob = new Blob([uploadedFile.buffer], { type: uploadedFile.mimetype });

            const loader = new PDFLoader(fileBlob);
            const documents = await loader.load();
            
            console.log('documents=>', documents);
  
            // You can now send the file to the backend or perform any other operations
            return res.status(200).json({ message: 'File uploaded successfully.' });
          });
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while processing the file.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
}