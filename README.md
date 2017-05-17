# insightUBC
This project is a full-stack web application that I developed as part of an introduction to Software Engineering class in UBC. 

Skills Used: Node.js, Javascript, Typescript, Mocha, jQuery, HTML, CSS

It allows users to parse courses(JSON) and rooms(HTML) data and process it using a query language. For more information on the project, please visit https://github.com/ubccpsc/310/tree/2017jan/project.

Installation information can be found below.
Query engine

Find below the EBNF for the query langauge supported by this program. Its' capabilities are very similar to the SQL language.

QUERY ::='{'BODY ', ' OPTIONS  (', ' TRANSFORMATIONS)? '}'

BODY ::= 'WHERE: {' (FILTER)? '}'
OPTIONS ::= 'OPTIONS: {' COLUMNS ', ' (SORT ', ')? VIEW '}'
TRANSFORMATIONS ::= 'TRANSFORMATIONS: {' GROUP ', ' APPLY '}'

FILTER ::= (LOGICCOMPARISON | MCOMPARISON | SCOMPARISON | NEGATION)

LOGICCOMPARISON ::= LOGIC ': [{' FILTER ('}, {' FILTER )* '}]'  
MCOMPARISON ::= MCOMPARATOR ': {' key ':' number '}'  
SCOMPARISON ::= 'IS: {' key ': ' [*]? string [*]? '}'  
NEGATION ::= 'NOT: {' FILTER '}'

LOGIC ::= 'AND' | 'OR' 
MCOMPARATOR ::= 'LT' | 'GT' | 'EQ' 

COLUMNS ::= 'COLUMNS:[' (string ',')* string ']' 
SORT ::= 'ORDER: ' ('{ dir:'  DIRECTION ', keys: [ ' string (',' string)* ']}' | key) 
DIRECTION ::= 'UP' | 'DOWN'  
VIEW ::= 'FORM: TABLE'  

GROUP ::= 'GROUP: [' (key ',')* key ']'                                                          
APPLY ::= 'APPLY: [' (APPLYKEY (', ' APPLYKEY )* )? ']'  
APPLYKEY ::= '{' string ': {' APPLYTOKEN ':' key '}}'
APPLYTOKEN ::= 'MAX' | 'MIN' | 'AVG' | 'COUNT' | 'SUM'                           


Configuring your environment

To start using this project you need to get your computer configured so you can build and execute the code. To do this, follow these steps; the specifics of each step (especially the first two) will vary based on which operating system your computer has:

    Install git (you should be able to execute git -v on the command line).

    Install Node, which will also install NPM (you should be able to execute node -v and npm -v the command line).

Project commands

Once your project is configured you need to further prepare the project's tooling and dependencies. In the  folder:

    npm run clean

    npm run configure

    npm run build

If you use Windows; instead try:

    npm run cleanwin

    npm run configurewin

    npm run build

Executing the unit test suite

The sample project ships with some automated unit tests. These commands will execute the suites:

    Test: npm run test (or npm test)
    Test coverage: npm run cover (or npm run coverwin if you use Windows). HTML reports can be found: ./coverage/lcov-report/index.html

You can also run the tests as a Mocha target inside your favourite IDE (WebStorm and VSCode both work well and are free for academic use)
Executing the public test suite


Starting the server:

    npm run start

You can then open the sample UI in your web browser by visiting http://localhost:4321. Alternatively, you can invoke the server using curl or some other tool that can hit your REST endpoints once the server is started.
Developing your project

If you are developing in Typescript you will have to re-compile the Typescript code. This can be done with npm run build to build the system and get it ready to execute. New unit tests can be written and added to /test; as long as the tests end in Spec.ts they will be executed automatically when you run npm run test.
Running and testing from an IDE

While these instructions are for WebStorm, other IDEs (e.g., VSCode, Atom, etc.) and editors (e.g., Sublime) should be similar, or will at least be compatible with the command line options described above.

To run or test the system in WebStorm you will need to configure run targets. To run the system go to the Run->Edit Configurations and tap on the + and then Node.js. Point the 'JavaScript file' argument to src/App.js. To run the system tests, go to the Run->Edit Configurations and tap on the + and then Mocha. Point the 'Test Directory' file argument to test/.
