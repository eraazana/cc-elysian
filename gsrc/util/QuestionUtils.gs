package util;
uses java.util.ArrayList
uses gw.api.database.Query
uses gw.api.database.QuerySelectColumns
uses gw.api.path.Paths
uses gw.config.LOBAbstraction

@Export
class QuestionUtils{

  public static function getAppropriateQuestionSet(claimInput : Claim) : QuestionSet[] {
    var questionSetTypes = new ArrayList<QuestionSetType>()
    questionSetTypes.add(TC_SIUGEN);
    if (LOBAbstraction.ForClaim.ForLossType.isAuto(claimInput)) {
      questionSetTypes.add(TC_SIUCAR);
    } else if (LOBAbstraction.ForClaim.ForLossType.isWorkComp(claimInput)) {
      questionSetTypes.add(TC_SIUWORK);
    }
    var query = Query.make(entity.QuestionSet)
           .compareIn("QuestionSetType", (questionSetTypes?.toTypedArray()))
           .select().orderBy(QuerySelectColumns.path(Paths.make(QuestionSet#QuestionSetType)))
                    .thenBy(QuerySelectColumns.path(Paths.make(QuestionSet#Priority)))
    
    var questionSets = new ArrayList<QuestionSet>()
    for (questionSet in query) {
      questionSets.add(questionSet)
    }
    return questionSets.toTypedArray()
  }

  public static function getQuestionSetTotalScore(answerContainer : gw.api.question.AnswerContainer, questionSetsTemp : QuestionSet[]) : int {
    var result = 0;
    for (questionSetTemp in questionSetsTemp){
       result = result + questionSetTemp.getPointTotal(answerContainer);
    }
    return result;
  }
}
