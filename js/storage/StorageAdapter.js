export class StorageAdapter {
  saveAssessment(assessment) {
    throw new Error("saveAssessment() must be implemented by a subclass");
  }

  getHistory() {
    throw new Error("getHistory() must be implemented by a subclass");
  }

  getAssessmentById(assessmentId) {
    throw new Error("getAssessmentById() must be implemented by a subclass");
  }

  exportAll() {
    throw new Error("exportAll() must be implemented by a subclass");
  }
}
