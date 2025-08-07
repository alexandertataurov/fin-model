import React from 'react';
import { FileUpload as FileUploadComponent } from '../components/FileUpload';

const FileUploadPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">File Upload</h1>
    <FileUploadComponent />
  </div>
);

export default FileUploadPage;
