package org.demo.imgscan.Controller;

import org.demo.imgscan.Model.DocumentFile;
import org.demo.imgscan.Service.DocumentFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.util.List;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/document")
public class DocumentFileController {

    private final DocumentFileService service;

    @Autowired
    public DocumentFileController(DocumentFileService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public void addDocumentFile(@RequestParam MultipartFile file) throws IOException {
        service.addDocumentFile(file);
    }

    @GetMapping("{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        return service.getFile(filename);
    }

    @GetMapping
    public List<DocumentFile> getAllFileInfos() {
        return service.getAllFileInfos();
    }
}
