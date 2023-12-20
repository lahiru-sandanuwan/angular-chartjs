import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss'],
})
export class FileViewerComponent implements OnInit {
  pdfSrc = '';
  textFile: string = '';
  jsonData: any;

  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad!: any;
  constructor() {}

  ngOnInit(): void {
    fetch('/api/sample_pdf.pdf')
      .then((response) => {
        // Handle the response

        this.pdfSrc = response.url;
        this.pdfViewerAutoLoad.pdfSrc = response.url; // pdfSrc can be Blob or Uint8Array
        this.pdfViewerAutoLoad.refresh();
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // public getTextFile(url: string) {
    //   return this.http.get(url, { responseType: 'text' });
    // }
    fetch('/api/sample_txt.txt')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Process the response as text
      })
      .then((text) => {
        this.textFile = text;
      })
      .catch((error) => {
        console.error('Error fetching the text file:', error);
      });

    fetch('/api/sample_json2˜.json')
      .then((response) => {
        // Check if the response is ok (status code in the range 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON from the response
      })
      .then((jsonData) => {
        this.jsonData = jsonData; // Use the parsed JSON data
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}
