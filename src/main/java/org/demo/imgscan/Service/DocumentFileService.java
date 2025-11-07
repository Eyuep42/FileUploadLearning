package org.demo.imgscan.Service;


import org.demo.imgscan.Datasource.DocumentFileDatasource;
import org.demo.imgscan.Model.DocumentFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
public class DocumentFileService {

    private final DocumentFileDatasource datasource;

    @Autowired
    public DocumentFileService(DocumentFileDatasource datasource) {
        this.datasource = datasource;
    }

    public List<DocumentFile> getAllFileInfos() {
        return datasource.findAll();
    }

    public ResponseEntity<Resource> getFile(String filename) {
        try {
            Path filePath = Paths.get("uploads").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<String> addDocumentFile(MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            Path uploadPath = Paths.get("uploads");
            Files.createDirectories(uploadPath);

            // Sichere und bereinigte Dateiname
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            Path filePath = uploadPath.resolve(originalFilename);

            // Datei speichern
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Metadaten speichern
            DocumentFile doc = new DocumentFile();
            doc.setFileName(originalFilename); // ← file.getName() gibt nur "file" zurück, nicht den Dateinamen!
            doc.setPath(filePath.toString());
            doc.setOwner("Magus");

            datasource.save(doc);

            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }


}

