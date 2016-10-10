Requerimentos:

1º - nodejs e npm instalados(https://nodejs.org/en/download/);

2º - Instalar a biblioteca oracledb para nodejs. Para isso precisa ser instalado: 

    - Python 2.7
    
    - C Compiler with support for C++ 11 (Xcode, gcc, Visual Studio or similar)
    
    - The small, free Oracle Instant Client "basic" and "SDK" packages if your database is remote. Or use the libraries and headers from a locally installed database such as the free Oracle XE release
    
    - Set OCI_LIB_DIR and OCI_INC_DIR during installation if the Oracle libraries and headers are in a non-default location
    
    - rodar npm install oracledb 
    maiores informações em: https://github.com/oracle/node-oracledb/blob/master/INSTALL.md
    
3º - Clonar o repositório e instalar os packeges da aplicação:
    
    - git clone https://github.com/marcosalm/RealtimeApp.git
    - cd RealtimeApp
    - npm install
    - bower install
    
4º - Configurar arquivo `server/dbconfig.js`:
    
    - Adicionar os dados para conecção no banco de dados.

5º - Rodar queries: [aplication-sql](https://github.com/marcosalm/RealtimeApp/blob/master/docs/aplication_sqls.md)
    
6º - Para rodar a aplicação:
    
    - npm start
