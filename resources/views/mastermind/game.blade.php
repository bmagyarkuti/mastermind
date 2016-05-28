@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="col-sm-12">
            <!-- Current Tasks -->
            @if (count($guesses) > 0)
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Earlier Guesses
                    </div>

                    <div class="panel-body">
                        @foreach($guesses as $index => $guess)
                        <div class="row">
                            <label class="col-sm-1 control-label">#{{$index + 1}}</label>

                            @foreach($guess as $color)
                                <div class="col-sm-2">
                                    <p>{{$color}}</p>
                                </div>
                            @endforeach

                        <!-- Add Task Button -->
                            <div class="col-sm-2">
                                <p>
                                @foreach($evals[$index] as $eval)
                                    {{$eval}}
                                @endforeach
                                </p>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
            @endif

            @if (!$isWon && count($guesses) < 10)
            <div class="panel panel-default">
                <div class="panel-heading">
                    New Guess
                </div>

                <div class="panel-body">
                    <!-- Display Validation Errors -->
                @include('common.errors')

                <!-- New Task Form -->
                    <form action="step" method="POST" class="form-horizontal">
                    {{ csrf_field() }}

                        <!-- Task Name -->
                            <div class="row">

                                <div class="form-group">
                                    <label class="col-sm-1 control-label">#{{count($guesses) + 1}}</label>


                                    @for($i = 1; $i <= 4; $i++)
                                    <div class="col-sm-2">
                                        <select name="color{{$i}}" title="" class="selectpicker form-control" id="{{$i}}" data-style="green">
                                            <option disabled selected value>Color...</option>
                                            @foreach($colors as $color)
                                                <option class="{{$color}}">{{$color}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    @endfor

                                <!-- Add Task Button -->
                                    <div class="col-sm-2">
                                        <button type="submit" class="btn btn-default">
                                            <i class="fa fa-btn fa-plus"></i>Send Guess
                                        </button>
                                    </div>
                                </div>
                            </div>
                    </form>
                </div>
            </div>
        </div>
        @else
        <div class="panel-body">
            <div class="jumbotron">
                    @if ($isWon)
                        <h1>
                        Congratulations, you cracked the code.
                        </h1>
                    @else
                        <h1>
                        Nope, that's still not it. However, your lives ran out.
                        <p>
                            The correct pattern was:
                            @foreach($codePattern as $color)
                                {{$color}}
                            @endforeach
                        </p>
                        </h1>
                    @endif
            </div>
        </div>
        @endif

    </div>
@endsection