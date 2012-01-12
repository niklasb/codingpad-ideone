var languages = {
    'c': {
        value: '11',
        display: 'C',
        mode: 'text/x-csrc',
        sample:
            '#include <stdio.h>\n' +
            '\n' +
            'int main(int argc, char** argv) {\n' +
            '  printf("Hello world!\\n");\n' +
            '}\n'
    },
    'c++': {
        value: '1',
        display: 'C++',
        mode: 'text/x-c++src',
        sample:
            '#include <iostream>\n' +
            '\n' +
            'int main(int argc, char** argv) {\n' +
            '  std::cout << "Hello world!" << std::endl;\n' +
            '}\n'
    },
    'c++11': {
        value: '44',
        display: 'C++11',
        mode: 'text/x-c++src',
        sample:
            '#include <iostream>\n' +
            '\n' +
            'int main(int argc, char** argv) {\n' +
            '  std::cout << "Hello world!" << std::endl;\n' +
            '}\n'
    },
    'd': {
        value: '102',
        display: 'D',
        mode: ''
    },
    'haskell': {
        value: '21',
        display: 'Haskell',
        mode: 'text/x-haskell'
    },
    'lua': {
        value: '26',
        display: 'Lua',
        mode: 'text/x-lua'
    },
    'ocaml': {
       value: '8',
       display: 'OCaml',
       mode: ''
    },
    'php': {
        value: '29',
        display: 'PHP',
        mode: 'text/x-php'
    },
    'perl': {
        value: '3',
        display: 'Perl',
        mode: 'text/x-perl'
    },
    'perl6': {
        value: '54',
        display: 'Perl',
        mode: 'text/x-perl'
    },
    'plain': {
        value: '62',
        display: 'Plain Text',
        mode: ''
    },
    'python': {
        value: '4',
        display: 'Python',
        mode: 'text/x-python'
    },
    'python3': {
        value: '116',
        display: 'Python 3',
        mode: 'text/x-python'
    },
    'ruby': {
        value: '17',
        display: 'Ruby',
        mode: 'text/x-ruby'
    },
    'scheme': {
        value: '33',
        display: 'Scheme',
        mode: 'text/x-scheme'
    },
    'tcl': {
        value: '38',
        display: 'Tcl',
        mode: ''
    },
    'java' : {
        value: '10',
        display: 'Java',
        mode: 'text/x-java',
        sample:
             'class Main {\n' +
             '  public static void main (String[] args) throws java.lang.Exception {\n' +
             '    System.out.println("Hello world!");\n' +
             '  }\n' +
             '}\n'
    },
    'js' : {
        value: '112',
        display: 'Javascript',
        mode: 'text/javascript'
    },
};

var language_order = [
  'c',
  'c++',
  'c++11',
  'd',
  'haskell',
  'lua',
  'ocaml',
  'php',
  'perl',
  'perl6',
  'plain',
  'python',
  'python3',
  'ruby',
  'scheme',
  'tcl',
  'java',
  'js',
];
