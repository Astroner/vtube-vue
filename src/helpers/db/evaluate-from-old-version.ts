import { DBModel } from "./db-model.class";

const recursionEvaluation = (
    currentModel: DBModel<any, any>,
    versionsDiff: number,
    state: any,
): any => {
    if (!currentModel.migrate) return null;
    if (versionsDiff === 1) {
        return currentModel.migrate(state);
    }
    
    if (!currentModel.prevModel) return null;

    const prevModelMigrationResult = recursionEvaluation(
        currentModel.prevModel, 
        versionsDiff - 1, 
        state,
    );

    if (!prevModelMigrationResult) return null;
    return currentModel.migrate(prevModelMigrationResult);
};

export const evaluateFromOldVersion = (
    currentModel: DBModel<any, any>, 
    originVersion: number,
    state: any,
): any => recursionEvaluation(
    currentModel, 
    currentModel.version - originVersion, 
    state,
);
