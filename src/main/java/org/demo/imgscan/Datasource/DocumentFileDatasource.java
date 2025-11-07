package org.demo.imgscan.Datasource;

import org.demo.imgscan.Model.DocumentFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentFileDatasource extends JpaRepository<DocumentFile, Long> {

}
