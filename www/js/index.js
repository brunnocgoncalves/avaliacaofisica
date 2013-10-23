/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var novoId;
var idAluno;

document.addEventListener("deviceready", onDeviceReady, false);

onDeviceReady();

function onDeviceReady() {
    var db = window.openDatabase("avaliacaoFisica", "1.0", "avaliacaoFisica", 200000);
    db.transaction(createDataBase, errorSQL, successCD);
    db.transaction(listaAlunos, errorSQL);
}

function createDataBase(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS S_ALUNO (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, datanascimento DATETIME, sexo TEXT, created DATETIME, updated DATETIME)');
}

function errorSQL(err) {
    $('#msg-error').popup("open");
    console.log("Error processing SQL: "+err.message);
}

function successCD() {
    console.log('Base de dados criada com sucesso!');
}

function listaAlunos(tx){
    tx.executeSql('SELECT * FROM S_ALUNO', [], successLA, errorSQL);
}

function successLA(tx, results) {
    console.log(results.rows.length);
    var len = results.rows.length;
    var parent = document.getElementById('listview');
    parent.innerHTML = "";
    for (var i=0; i<len; i++){
        
        parent.innerHTML = parent.innerHTML + '<li><a href="#" onclick="openAluno(' +results.rows.item(i).id+ ', \''+ results.rows.item(i).nome +'\');">'
                        + '<h2>' + results.rows.item(i).nome + '</h2>'
                        + '</a></li>';
 
        novoId = results.rows.item(i).id;
    }
    
    var list = document.getElementById('listview');
    $(list).listview("refresh");
    
    novoId = novoId + 1;
}

function save(){
    var db = window.openDatabase("avaliacaoFisica", "1.0", "avaliacaoFisica", 200000);
    db.transaction(createAluno, errorSQL, successCA);
}

function createAluno(tx) {
    varNome = document.getElementById("text-name").value;
    varEmail = document.getElementById("email").value;
    vardatanascimento = document.getElementById("date").value;
    varSexo = $('#radio-choice-c').filter(':checked').val();
    if(varSexo!="Masculino")
        {
            varSexo = "Feminino";
        }
    tx.executeSql('INSERT INTO S_ALUNO (nome, email, datanascimento, sexo, created) VALUES ("' + varNome + '", "' + varEmail + '", "' + vardatanascimento + '", "' + varSexo + '", datetime("now"))');
}

function successCA() {
    $('#msg-sucess').popup("open");
    
    var db = window.openDatabase("avaliacaoFisica", "1.0", "avaliacaoFisica", 200000);
    db.transaction(listaAlunos, errorSQL);

    document.getElementById("text-name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("date").value = "";
}

function openAluno(id, nome){
    idAluno = id;
    console.log('Aluno ' + idAluno);
    var db = window.openDatabase("avaliacaoFisica", "1.0", "avaliacaoFisica", 200000);
    db.transaction(carregaAluno, errorSQL);
    //db.transaction(listaAlunos2, errorSQL);
    $.mobile.changePage("#pagealuno");
}

function carregaAluno(tx){
    tx.executeSql('SELECT '
        + 'strftime("%d/%m/%Y",S.datanascimento) datanascimento '
        + ',S.nome '
        + ',S.email '
        + ',S.sexo '
        + 'FROM S_ALUNO S '
        + 'Where '
        + 'S.id = ' + idAluno
        , [], successLoadAluno, errorSQL);
}

function successLoadAluno(tx, results) {
    console.log("Load Aluno");
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        document.getElementById('nomeAluno').innerHTML = results.rows.item(i).nome;
        document.getElementById('dadosAluno').innerHTML = '<p>E-mail: ' + results.rows.item(i).email + '</p>'
                        + '<p>Sexo: ' + results.rows.item(i).sexo + '</strong></p>'
                        + '<p>Data de nascimento: ' + results.rows.item(i).datanascimento + '</strong></p>';
    }
    var db = window.openDatabase("avaliacaoFisica", "1.0", "avaliacaoFisica", 200000);
    db.transaction(listaAlunos2, errorSQL);
}

function listaAlunos2(tx){
    tx.executeSql('SELECT * FROM S_ALUNO', [], successLAAlunos, errorSQL);
}

function successLAAlunos(tx, results) {
    console.log(results.rows.length);
    var len = results.rows.length;
    var parent = document.getElementById('listviewAlunos');
    parent.innerHTML = '<li><a href="#cadastroAluno">Novo aluno</a></li>';
    for (var i=0; i<len; i++){
        
        parent.innerHTML = parent.innerHTML + '<li><a href="#" onclick="openAluno(' +results.rows.item(i).id+ ', \''+ results.rows.item(i).nome +'\');">'
                        + '<h2>' + results.rows.item(i).nome + '</h2>'
                        + '</a></li>';
 
        novoId = results.rows.item(i).id;
        
    }
    
    var list = document.getElementById('listviewAlunos');
    $(list).listview("refresh");
    
    novoId = novoId + 1;
}

function excluir(){
        $('#deleteAluno').popup("open");
}

function removeAluno(){
    var db = window.openDatabase("avaliacaoFisica", "1.0", "avaliacaoFisica", 200000);
    db.transaction(deleteAluno, errorSQL, deleteSucess);
}

function deleteAluno(tx){
    tx.executeSql('DELETE FROM S_ALUNO WHERE id = ' + idAluno);
}

function deleteSucess(){
    var db = window.openDatabase("avaliacaoFisica", "1.0", "avaliacaoFisica", 200000);
    db.transaction(listaAlunos, errorSQL);
    $.mobile.changePage("#cadastroAluno");
}