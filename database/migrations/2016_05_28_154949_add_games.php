<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGames extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('started');
            $table->dateTime('won')->nullable();
            $table->integer('steps');
            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });

        DB::statement("ALTER TABLE games ADD CONSTRAINT Integer_CK CHECK (steps BETWEEN 1 AND 10)");
        // apparently there's no check constraint in mysql, so this is redundant
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('games');
    }
}
