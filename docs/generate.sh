rm ./output/*
plantuml -tsvg ./uml/**/* -o $PWD/output/
#plantuml ./classes.plantuml
#plantuml -tpdf ./classes.plantuml